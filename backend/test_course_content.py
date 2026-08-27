import unittest

from app.content.modules_seed import (
    ACTIVE_MODULE_SLUGS,
    COURSE_MODULE_SLUGS,
    ENGLISH_MODULES,
    RUSSIAN_MODULES,
    base_module_slug,
    course_id_for_slug,
)


class CourseContentTest(unittest.TestCase):
    def test_courses_have_matching_unique_missions(self) -> None:
        self.assertEqual(len(ACTIVE_MODULE_SLUGS), 18)
        self.assertEqual(len(set(ACTIVE_MODULE_SLUGS)), 18)
        self.assertEqual([module["order_index"] for module in ENGLISH_MODULES], list(range(1, 10)))
        self.assertEqual([module["order_index"] for module in RUSSIAN_MODULES], list(range(1, 10)))
        self.assertEqual(
            COURSE_MODULE_SLUGS["en"],
            tuple(base_module_slug(slug) for slug in COURSE_MODULE_SLUGS["ru"]),
        )
        self.assertTrue(all(course_id_for_slug(slug) == "ru" for slug in COURSE_MODULE_SLUGS["ru"]))


if __name__ == "__main__":
    unittest.main()
