set dotenv-load := true

# Show available recipes
help:
    just --list

# Remove build artifacts and clear Turborepo cache
clean:
    find . -type d \( -name dist -o -name build -o -name .turbo \) -exec rm -rf {} +

# Remove build artifacts, node_modules
clean-all: clean
    find . -type d -name node_modules -not -path "*/node_modules/*" -prune -exec rm -rf {} +