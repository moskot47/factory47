def greet(name: str = "world") -> str:
    return f"Hello, {name}! Welcome to factory47."


def main() -> None:
    print(greet())


if __name__ == "__main__":
    main()
