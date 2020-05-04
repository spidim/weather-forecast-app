# coding: utf-8

import sys
from setuptools import setup, find_packages

NAME = "backend_server"
VERSION = "1.0.0"

# To install the library, run the following
#
# python setup.py install
#
# prerequisite: setuptools
# http://pypi.python.org/pypi/setuptools

REQUIRES = ["connexion"]

setup(
    name=NAME,
    version=VERSION,
    description="Weather Forecast API",
    author_email="sdimopoulos@irisweb.gr",
    url="",
    keywords=["Weather Forecast API"],
    install_requires=REQUIRES,
    packages=find_packages(),
    package_data={'': ['swagger/swagger.yaml','supported_cities.json']},
    include_package_data=True,
    entry_points={
        'console_scripts': ['backend_server=backend_server.__main__:main']},
    long_description="""\
    This is the weather forecast API. For more info contact sdimopoulos@irisweb.gr
    """
)
