import unittest

from factory47.main import greet


class TestGreet(unittest.TestCase):
    def test_default(self):
        self.assertEqual(greet(), "Hello, world! Welcome to factory47.")

    def test_name(self):
        self.assertIn("Tal", greet("Tal"))


if __name__ == "__main__":
    unittest.main()
