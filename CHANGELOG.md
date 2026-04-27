# Changelog

## [1.0.2](https://github.com/treetrum/open-on-remote-ext/compare/v1.0.1...v1.0.2) (2026-04-27)


### Dependencies

* pin dependency @vscode/vsce to 3.9.1 ([#17](https://github.com/treetrum/open-on-remote-ext/issues/17)) ([1b95547](https://github.com/treetrum/open-on-remote-ext/commit/1b95547746a795c5fec2d274c96398437a803767))
* update dependency oxlint to v1.62.0 ([#19](https://github.com/treetrum/open-on-remote-ext/issues/19)) ([772a6a3](https://github.com/treetrum/open-on-remote-ext/commit/772a6a3494baa4d8b5b3aba59d3825da09a44f60))

## [1.0.1](https://github.com/treetrum/open-on-remote-ext/compare/v1.0.0...v1.0.1) (2026-04-23)


### Fixes

* bump engines.vscode to match @types/vscode 1.116.0 ([6ab6f1c](https://github.com/treetrum/open-on-remote-ext/commit/6ab6f1cc25841db29695e7e87d8669374d3cbd25))


### Internal Changes

* add LICENSE, pin vsce as dev dependency ([18904b2](https://github.com/treetrum/open-on-remote-ext/commit/18904b272632cdad217d5ec65e73c7cf3a52b29a))
* add README ([50f1a4b](https://github.com/treetrum/open-on-remote-ext/commit/50f1a4bcf2e65e833af295e438b85f9e63492324))

## [1.0.0](https://github.com/treetrum/open-on-remote-ext/compare/v0.1.0...v1.0.0) (2026-04-23)


### ⚠ BREAKING CHANGES

* consolidate to two commands with unified ref picker

### Features

* consolidate to two commands with unified ref picker ([79adf21](https://github.com/treetrum/open-on-remote-ext/commit/79adf21095eeb0bfe5af576f9ecb5a51ba9f6b0d))


### Fixes

* omit line anchor when linking to a branch ref ([e7b69d8](https://github.com/treetrum/open-on-remote-ext/commit/e7b69d8c07dfcd2e94a12ce8e48119d4067ff2a1))
* omit line anchor when there is no active text selection ([6b17586](https://github.com/treetrum/open-on-remote-ext/commit/6b17586cd5c9b4ef403f5d85a3e53281034c0b1b))
* only include selection when active editor matches the target file ([9228c25](https://github.com/treetrum/open-on-remote-ext/commit/9228c256bad8b06ef011009411d8a4c6dbd91c3f))


### Dependencies

* pin dependencies ([#6](https://github.com/treetrum/open-on-remote-ext/issues/6)) ([a589d81](https://github.com/treetrum/open-on-remote-ext/commit/a589d813492a93b24a67708d7e03c923c6baa516))
* update actions/checkout action to v6 ([#14](https://github.com/treetrum/open-on-remote-ext/issues/14)) ([9a17098](https://github.com/treetrum/open-on-remote-ext/commit/9a1709825a9972d114e0ec09647432ed3851cdb7))
* update actions/checkout action to v6 ([#7](https://github.com/treetrum/open-on-remote-ext/issues/7)) ([98b3d8f](https://github.com/treetrum/open-on-remote-ext/commit/98b3d8f8c71e3d2f99f8f0e1f3fe22ebbad47227))
* update actions/setup-node action to v6 ([#15](https://github.com/treetrum/open-on-remote-ext/issues/15)) ([ea080ac](https://github.com/treetrum/open-on-remote-ext/commit/ea080acf092774188bda593adf00894d455e62fe))
* update actions/setup-node action to v6 ([#9](https://github.com/treetrum/open-on-remote-ext/issues/9)) ([371a024](https://github.com/treetrum/open-on-remote-ext/commit/371a02400afd4d8ab722a994ef1b5f70bf7bf968))
* update dependency @types/node to v24 ([#10](https://github.com/treetrum/open-on-remote-ext/issues/10)) ([b046062](https://github.com/treetrum/open-on-remote-ext/commit/b04606208f674a845f08e0284dbb5cc598df6729))
* update dependency typescript to v6 ([#11](https://github.com/treetrum/open-on-remote-ext/issues/11)) ([e077732](https://github.com/treetrum/open-on-remote-ext/commit/e0777322e8cb2518dfccadad4f142d41eb82baea))
* update googleapis/release-please-action action to v5 ([#12](https://github.com/treetrum/open-on-remote-ext/issues/12)) ([a7c0fb3](https://github.com/treetrum/open-on-remote-ext/commit/a7c0fb3da4cc515a638bbe2f7608332857327f20))


### Internal Changes

* add .node-version file pinned to Node 24 ([6bf5a97](https://github.com/treetrum/open-on-remote-ext/commit/6bf5a9766597082ea4513e9d706c116715e49070))
* add CI workflow to lint and build on PRs to main ([d8f5d7e](https://github.com/treetrum/open-on-remote-ext/commit/d8f5d7e1078308147e269ac037386951a6945910))
* add renovate config extending treetrum shared preset ([e91cea4](https://github.com/treetrum/open-on-remote-ext/commit/e91cea458af9992c2163c3447742ff784c8f1cd0))
* lint whole repo ([5ee1772](https://github.com/treetrum/open-on-remote-ext/commit/5ee17728f0cb4611940fa795e79550ee5a877503))
* reconfigure release-please ([20c2fda](https://github.com/treetrum/open-on-remote-ext/commit/20c2fdae9e7737d9f1edcf33a10954fb0d532b9a))
* release 1.0.0 ([9b3d3c1](https://github.com/treetrum/open-on-remote-ext/commit/9b3d3c1eccfb8679555ec2c135292e6a34629f96))
* rename extension display name to 'Open Remote' ([e36debc](https://github.com/treetrum/open-on-remote-ext/commit/e36debca7b92c4cca0a4d60970ca4312a47873a3))

## 0.1.0 (2026-04-23)


### Features

* add editor context menu entries and simplify HEAD command titles ([afee60b](https://github.com/treetrum/open-on-remote-ext/commit/afee60be324a2d5b8e9e1904816d0cdff952cdaa))
* implement open-on-remote extension ([56e5436](https://github.com/treetrum/open-on-remote-ext/commit/56e54366dd2898f485ecf3dd5c3444f99610615d))
* move context menu to file explorer and thread URI argument ([c3748d8](https://github.com/treetrum/open-on-remote-ext/commit/c3748d8b85385bc031c28a8e6cff62c039c9ad13))


### Bug Fixes

* pass custom token to release-please to allow PR creation ([da33e43](https://github.com/treetrum/open-on-remote-ext/commit/da33e43254cd82ec9237e5857c50e3a39ce5b2cf))


### Miscellaneous Chores

* release 0.1.0 ([af501b9](https://github.com/treetrum/open-on-remote-ext/commit/af501b98833acd4f20755fa15265f800dbcafd00))
