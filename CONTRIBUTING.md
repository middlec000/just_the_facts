# Contributing to Just the Facts

Thank you for your interest in contributing to Just the Facts! We welcome contributions from the community and appreciate your help in making this project better.

## Code of Conduct

By participating in this project, you are expected to uphold a respectful and collaborative environment. Be kind, constructive, and considerate in all interactions.

## How to Contribute

### 1. Fork the Repository

Start by forking the repository to your own GitHub account. This creates a copy of the project where you can make your changes.

1. Click the **Fork** button at the top right of the repository page
2. This creates a copy at `https://github.com/YOUR_USERNAME/just_the_facts`

### 2. Clone Your Fork

Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/just_the_facts.git
cd just_the_facts
```

Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/middlec000/just_the_facts.git
```

### 3. Create a Branch

Create a new branch for your changes. Use a descriptive name that reflects what you're working on:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

Branch naming conventions:
- `feature/` — for new features
- `fix/` — for bug fixes
- `docs/` — for documentation changes
- `test/` — for adding or updating tests
- `refactor/` — for code refactoring

### 4. Make Your Changes

1. Make your changes in your branch
2. Follow the existing code style and conventions
3. Write clear, concise commit messages
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Run linting: `npm run lint`
7. Check types: `npm run type-check`

### 5. Commit Your Changes

Write clear and meaningful commit messages:

```bash
git add .
git commit -m "Add feature: brief description of what changed"
```

Commit message guidelines:
- Use the imperative mood ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issue numbers if applicable (e.g., "Fix #123: description")

### 6. Keep Your Branch Updated

Before submitting your changes, sync your branch with the latest changes from the main repository:

```bash
git fetch upstream
git rebase upstream/main
```

If there are conflicts, resolve them and continue the rebase:

```bash
# After resolving conflicts
git add .
git rebase --continue
```

### 7. Push Your Changes

Push your changes to your fork:

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

1. Go to your fork on GitHub
2. Click the **Compare & pull request** button
3. Fill out the pull request template with:
   - **Title**: A clear, concise description of your changes
   - **Description**: What changes you made and why
   - **Related Issues**: Link to any related issues (e.g., "Closes #123")
4. Submit the pull request

### Pull Request Guidelines

- Ensure all CI checks pass
- Respond to feedback and make requested changes
- Keep the PR focused on a single feature or fix
- Update documentation if your changes affect user-facing functionality
- Add tests to cover new code

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Create .env.local
   DATABASE_URL=your_neon_connection_string
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## What to Contribute

We welcome contributions in many forms:

- **Bug fixes**: Found a bug? Submit a fix!
- **New features**: Have an idea? Discuss it in an issue first
- **Documentation**: Improve or add to our docs
- **Tests**: Help us increase test coverage
- **Code quality**: Refactoring, optimization, and cleanup

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the label `question`
- Reach out to the maintainers

Thank you for contributing to Just the Facts! 🎉
