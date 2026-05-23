# CONTRIBUTING.md - Contribution Guide

## Welcome to UR-Message Backend! 👋

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and abide by our Code of Conduct.

- Be respectful and inclusive
- Welcome newbie contributors
- Provide constructive feedback
- Focus on what is best for the community

## How to Contribute

### 1. Bug Reports

Found a bug? Create an issue with:

- **Title**: Clear, concise description
- **Description**: Steps to reproduce, expected vs actual behavior
- **Environment**: Node version, OS, MongoDB version
- **Logs**: Error messages and stack traces
- **Code snippet**: Minimal reproducible example

### 2. Feature Requests

Have an idea? Submit a feature request with:

- **Title**: Clear feature description
- **Motivation**: Why this feature is needed
- **Implementation**: How it could be implemented
- **Example**: Usage example

### 3. Pull Requests

#### Setup Development Environment

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/ur-message-backend.git
cd ur-message-backend

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install
```

#### Development Workflow

```bash
# Make changes to code
# Update tests if applicable
# Test locally
npm run dev

# Lint code
npm run lint

# Run tests
npm test

# Commit with clear message
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

#### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, semicolons, etc)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies

Examples:
```
feat(auth): add two-factor authentication
fix(messages): resolve message duplication bug
docs: update installation instructions
refactor(models): simplify user schema
```

### Project Structure Guidelines

Maintain clean architecture:

```
controllers/     ← Business logic (pure functions)
models/          ← Database schemas
routes/          ← API endpoint definitions
middleware/      ← Request processing
sockets/         ← Real-time event handlers
utils/           ← Reusable utilities
config/          ← Configuration files
services/        ← Complex business logic
```

### Code Style Guidelines

#### JavaScript Standards

```javascript
// ✅ Good
async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    return user.getPublicProfile();
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// ❌ Bad
function getUserById(userId) {
  return User.findById(userId); // No error handling
}

// ❌ Bad
async function getuser(x) { // Inconsistent naming
  var y = await User.findById(x) // var usage
  return y
}
```

#### Naming Conventions

- **Functions/Variables**: camelCase
  ```javascript
  const getUserById = async (userId) => { ... }
  const userProfile = { ... }
  ```

- **Classes/Constructors**: PascalCase
  ```javascript
  class UserController { ... }
  const User = require('./models/User');
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```javascript
  const MAX_LOGIN_ATTEMPTS = 5;
  const DEFAULT_TIMEOUT = 30000;
  ```

- **Files**: 
  - Controllers: `userController.js`
  - Models: `User.js`
  - Routes: `userRoutes.js`
  - Utilities: `logger.js`

#### Error Handling

```javascript
// ✅ Good - Proper error handling
try {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  res.status(200).json({ success: true, data: user });
} catch (error) {
  logger.error('Error fetching user:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

// ❌ Bad - No error handling
const user = await User.findById(userId);
res.json(user);
```

#### Comments

```javascript
// ✅ Good - Clear, concise comments
/**
 * Fetch user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId) => { ... }

// Document complex logic
if (condition) {
  // Handle edge case where user is blocked
  return res.status(403).json(...);
}

// ❌ Bad - Obvious comments
const name = user.name; // Get user name
for (let i = 0; i < 10; i++) { // Loop 10 times
  // ...
}
```

#### Async/Await

```javascript
// ✅ Good
async function sendMessages(messages) {
  try {
    const results = await Promise.all(
      messages.map(msg => saveMessage(msg))
    );
    return results;
  } catch (error) {
    throw error;
  }
}

// ❌ Bad - Callback hell
function sendMessages(messages, callback) {
  for (let msg of messages) {
    saveMessage(msg, function(err, result) {
      if (err) callback(err);
      else callback(null, result);
    });
  }
}
```

### Testing Guidelines

```javascript
// Example test structure
describe('User Controller', () => {
  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = 'user123';
      const user = await getUserById(userId);
      expect(user).toBeDefined();
    });

    it('should return null when user not found', async () => {
      const userId = 'invalid';
      const user = await getUserById(userId);
      expect(user).toBeNull();
    });
  });
});
```

### Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying database schemas
- Adding new environment variables

Update these files:
- `README.md` - General information
- `API_TESTING.md` - API examples
- `QUICKSTART.md` - Quick setup
- `ARCHITECTURE.md` - System design

## Review Process

1. **Automated Checks**
   - Linting (ESLint)
   - Tests must pass
   - Code coverage maintained

2. **Code Review**
   - At least 1 maintainer approval
   - Clear comments and documentation
   - Follows project standards

3. **Approval & Merge**
   - All checks passing
   - Approved by maintainers
   - Squash commits for clean history

## Development Tips

### Debugging

```bash
# Run with verbose logging
DEBUG=* npm run dev

# Use Node debugger
node --inspect src/server.js
# Then visit chrome://inspect
```

### Database Testing

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use ur-message database
use ur-message

# List collections
show collections

# Find documents
db.users.findOne()
db.messages.find().limit(5)
```

### Testing API Endpoints

```bash
# Use Postman, Insomnia, or Thunder Client
# Or use curl from terminal:
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Considerations

- Avoid N+1 queries with populate/joins
- Use pagination for large datasets
- Add indexes for frequently queried fields
- Cache where appropriate
- Monitor database performance

```javascript
// ✅ Good - Uses pagination and lean()
const users = await User.find()
  .lean()
  .skip(skip)
  .limit(limit);

// ❌ Bad - Fetches all users
const users = await User.find();
```

## Security Best Practices

- Never commit secrets to repository
- Validate all user inputs
- Use parameterized queries (Mongoose does this)
- Hash sensitive data
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated

```bash
# Regular security checks
npm audit
npm audit fix
```

## Version Management

Semantic Versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

Example: `1.2.3`

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Tag release: `git tag v1.2.3`
5. Push: `git push origin && git push origin --tags`
6. Create GitHub release with notes

## Getting Help

- **Issues**: Check existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for security issues
- **Discord**: Join community channel

## Resources for Contributors

- [Node.js Style Guide](https://github.com/felixgeisendorfer/node-style-guide)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/best-practices/)

## Code Review Checklist

Before submitting PR, ensure:

- [ ] Code follows project style guide
- [ ] All tests pass locally
- [ ] No console.log() statements (use logger)
- [ ] Proper error handling implemented
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No hardcoded secrets
- [ ] Performance optimizations considered
- [ ] Security best practices followed
- [ ] Compatible with Node.js version

## Thank You! 🙏

Your contributions make UR-Message better for everyone. We appreciate:
- Bug reports
- Feature suggestions
- Code contributions
- Documentation improvements
- Community support

---

**Contributing Guide** - Join us in building amazing software!
