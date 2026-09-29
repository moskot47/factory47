def greet(name: str = "world") -> str:
    return f"Hello, {name}! Welcome to factory47."


def main() -> None:
    """Start the cozy fireplace web app."""
    from factory47.server import serve

    serve()


if __name__ == "__main__":
    main()
