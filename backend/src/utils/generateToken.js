import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for an authenticated user
 * @param {string} id - User ID
 * @param {string} role - User role (e.g. 'freelancer' | 'client')
 * @returns {string} Signed JWT
 */
export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'freelancehub_pk_default_dev_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id,
      role
    },
    secret,
    {
      expiresIn
    }
  );
};

export default generateToken;
