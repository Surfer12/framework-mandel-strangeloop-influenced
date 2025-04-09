# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- Install dependencies: `cargo build` or `cargo build --all-features`
- Build package: `cargo build --release`
- Run the project: `cargo run` 
- Run tests: `cargo test`
- Run a single test: `cargo test test_name` (e.g., `cargo test test_process_node`)
- Lint code: `cargo clippy -- -D warnings`
- Format code: `cargo fmt`
- Documentation: `cargo doc --open`

## Code Style Guidelines
- Rust edition: 2024
- Follow Rust standard naming conventions: snake_case for variables/functions, PascalCase for types/structs/enums
- Use proper error handling with anyhow::Result and thiserror for custom errors
- Include comprehensive type annotations, especially in public APIs
- Prefer async/await for asynchronous code with tokio
- Ensure functions and structs have proper documentation comments (///)
- Prefer Arc for shared ownership in a concurrent context
- Use strong typing with enums for state representation
- Organize code by functionality into modules
- Follow fractal-inspired design patterns for cognitive processing
- For interactive components, ensure React code follows component-based architecture