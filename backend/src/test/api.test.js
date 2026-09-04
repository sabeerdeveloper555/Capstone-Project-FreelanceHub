import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../app.js';

const { Client, Project, User, queryResult, makeUser } = vi.hoisted(() => {
  const queryResult = (value) => ({
    populate: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    then: (resolve, reject) => Promise.resolve(value).then(resolve, reject),
  });
  const makeUser = (data) => ({
    ...data,
    matchPassword: vi.fn().mockResolvedValue(true),
  });
  return {
    Client: {
      create: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
    },
    Project: {
      create: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
    },
    User: {
      create: vi.fn(),
      findOne: vi.fn(),
      findById: vi.fn(),
    },
    queryResult,
    makeUser,
  };
});

vi.mock('../models/index.js', () => ({ Client, Project, User }));

process.env.JWT_SECRET = 'freelancehub-test-secret';

const register = async (overrides = {}) => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Freelancer',
      email: `freelancer-${Date.now()}-${Math.random()}@example.com`,
      password: 'password123',
      role: 'freelancer',
      ...overrides,
    });

  return response.body;
};

beforeEach(() => {
  vi.clearAllMocks();
  User.findOne.mockResolvedValue(null);
  User.findById.mockReturnValue(queryResult(null));
  Client.find.mockReturnValue(queryResult([]));
  Project.find.mockReturnValue(queryResult([]));
});

describe('authentication API', () => {
  it('registers a freelancer and returns a JWT', async () => {
    const user = makeUser({ _id: 'user-1', name: 'Ayesha Khan', email: 'ayesha@example.com', role: 'freelancer' });
    User.create.mockResolvedValue(user);

    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ayesha Khan', email: 'ayesha@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toMatchObject({
      name: 'Ayesha Khan',
      email: 'ayesha@example.com',
      role: 'freelancer',
    });
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('logs in with registered credentials', async () => {
    const user = makeUser({ _id: 'user-2', name: 'Test Freelancer', email: 'login@example.com', role: 'freelancer' });
    User.create.mockResolvedValue(user);
    const registration = await register({ email: 'login@example.com' });
    User.findOne.mockResolvedValue(user);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, message: 'Login successful' });
    expect(response.body.user.id).toBe(registration.user.id);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('rejects invalid login credentials', async () => {
    const user = makeUser({ _id: 'user-3', email: 'invalid-login@example.com', role: 'freelancer' });
    user.matchPassword.mockResolvedValue(false);
    User.create.mockResolvedValue(user);
    await register({ email: 'invalid-login@example.com' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-login@example.com', password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});

describe('authorization and resource APIs', () => {
  it('rejects protected client access without a token', async () => {
    const response = await request(app).get('/api/clients');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized, no token provided');
  });

  it('creates and retrieves clients for the authenticated freelancer', async () => {
    const user = makeUser({ _id: 'user-4', name: 'Test Freelancer', email: 'clients@example.com', role: 'freelancer' });
    User.create.mockResolvedValue(user);
    const registration = await register({ email: 'clients@example.com' });
    User.findById.mockReturnValue(queryResult(user));
    const client = { _id: 'client-1', name: 'Acme Client', email: 'contact@acme.com', company: 'Acme', owner: user._id };
    Client.create.mockResolvedValue(client);
    Client.find.mockReturnValue(queryResult([client]));
    const headers = { Authorization: `Bearer ${registration.token}` };

    const createResponse = await request(app)
      .post('/api/clients')
      .set(headers)
      .send({ name: 'Acme Client', email: 'contact@acme.com', company: 'Acme' });
    const listResponse = await request(app).get('/api/clients').set(headers);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.client).toMatchObject({ name: 'Acme Client', company: 'Acme' });
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toMatchObject({ success: true, count: 1 });
    expect(listResponse.body.clients[0].email).toBe('contact@acme.com');
  });

  it('creates and retrieves a project linked to an owned client', async () => {
    const user = makeUser({ _id: 'user-5', name: 'Test Freelancer', email: 'projects@example.com', role: 'freelancer' });
    User.create.mockResolvedValue(user);
    const registration = await register({ email: 'projects@example.com' });
    const headers = { Authorization: `Bearer ${registration.token}` };
    User.findById.mockReturnValue(queryResult(user));
    const client = { _id: '507f1f77bcf86cd799439011', name: 'Project Client', email: 'project-client@example.com', owner: user._id };
    Client.create.mockResolvedValue(client);
    Client.findById.mockReturnValue(queryResult(client));
    const clientResponse = await request(app)
      .post('/api/clients')
      .set(headers)
      .send({ name: 'Project Client', email: 'project-client@example.com' });
    const clientId = clientResponse.body.client._id;
    const project = { _id: 'project-1', title: 'Website redesign', budget: 85000, client: clientId, owner: user._id };
    Project.create.mockResolvedValue(project);
    Project.findById.mockReturnValue(queryResult({ ...project, client }));
    Project.find.mockReturnValue(queryResult([{ ...project, client }]));

    const createResponse = await request(app)
      .post('/api/projects')
      .set(headers)
      .send({
        title: 'Website redesign',
        description: 'Refresh the client website',
        client: clientId,
        budget: 85000,
        deadline: '2026-12-31',
        status: 'Planning',
      });
    const listResponse = await request(app).get('/api/projects').set(headers);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.project).toMatchObject({ title: 'Website redesign', budget: 85000 });
    expect(createResponse.body.project.client.name).toBe('Project Client');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.count).toBe(1);
    expect(listResponse.body.projects[0].title).toBe('Website redesign');
  });

  it('forbids a client role from accessing freelancer resources', async () => {
    const user = makeUser({ _id: 'user-6', name: 'Client User', email: 'client-role@example.com', role: 'client' });
    User.create.mockResolvedValue(user);
    const registration = await register({ email: 'client-role@example.com', role: 'client' });
    User.findById.mockReturnValue(queryResult(user));

    const response = await request(app)
      .get('/api/clients')
      .set('Authorization', `Bearer ${registration.token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("User role 'client' is not authorized");
  });
});
