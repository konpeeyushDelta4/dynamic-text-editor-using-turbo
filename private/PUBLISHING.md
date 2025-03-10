# Publishing Instructions

## Prerequisites

1. Ensure you have npm and git installed
2. Have access to both the GitHub repository and npm package
3. Logged in to npm (`npm login`)
4. GitHub repository is properly configured with NPM_TOKEN secret

## Publishing a New Version

### Manual Publishing

1. Make your code changes
2. Update CHANGELOG.md with your changes
3. Run the publish script:
   ```bash
   ./scripts/publish.sh
   ```
4. Select version bump type when prompted:
   - 1 for patch (x.x.X) - Bug fixes
   - 2 for minor (x.X.0) - New features
   - 3 for major (X.0.0) - Breaking changes

The script will:

- Run tests
- Build the package
- Bump version in package.json
- Create git tag
- Push to GitHub
- Publish to npm

### Automated Publishing via GitHub Actions

1. Make your code changes
2. Update CHANGELOG.md
3. Create and push a new tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

The GitHub Action will automatically:

- Build the package
- Publish to npm when the tag is pushed

## Troubleshooting

- If npm publish fails, check:
  - You're logged in (`npm login`)
  - Package name is available
  - Version number is unique
- If GitHub Actions fail, verify:
  - NPM_TOKEN secret is set correctly
  - You have proper permissions
