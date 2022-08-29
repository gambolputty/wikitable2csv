# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [3.0.0] - 2022-08-29
### Changed
- Complete rewrite as React app
### Fixed
- Several parsing issues

## [2.2.6] - 2019-12-18
### Fixed
- fixed dependencies
- matomo script

## [2.2.5] - 2019-01-15
### Added
- Added link to JSON converter
- Support for different Wikimedia Urls. See [#9](../../issues/9)
### Changed
- [ParcelJS](https://parceljs.org) as build system :)
- UI changes
- better error handling
### Fixed
- improved url parsing (for other Wikimedia projects)
- Updated dependencies & Matomo script
- fixed vulnerability of dependency package
- Row-/colspan bugfix, see [#25](../../issues/25)

## [2.2.0] - 2018-07-25
### Added
- Added download button
- Gulp 4
### Fixed
- Bugfix: colSpan & rowSpan messed up. See [#10](../../issues/10)

## [2.1.0] - 2018-01-18
### Added
- parsing row- and col-span-attributes, thanks to [@bschreck](https://github.com/bschreck)

## [2.0.0] - 2018-01-17
### Added
- Parsing tables from other Wikis (Wikimedia.org, Wikibooks.org etc.)
- added button to copy all tables at once (concat textareas value, seperated by empty line)
- additional acceptance tests
### Fixed
- updated dependencies in package.json

## [1.9.0] - 2018-01-05
### Added
- Code refactoring: Vanilla JS (removed jQuery), module pattern
- better performance
- preparing for version 2