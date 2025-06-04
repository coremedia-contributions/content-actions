![CoreMedia Content Cloud Version](https://img.shields.io/static/v1?message=2412&label=CoreMedia%20Content%20Cloud&style=for-the-badge&labelColor=666666&color=672779 "This badge shows the CoreMedia version(s) this project is compatible with.
Please read the versioning section of the project to see what other CoreMedia versions are supported and how to find them.")
![Status](https://img.shields.io/static/v1?message=active&label=Status&style=for-the-badge&labelColor=666666&color=2FAC66
"The status badge describes if the project is maintained. Possible values are active and inactive.
If a project is inactive it means that the development has been discontinued and won't support future CoreMedia versions."
)

# Studio Content Actions for CoreMedia Blueprint
This extension adds a Content-Actions Button to the document form toolbar and removes the Action-Toolbar

![content-actions-01.png](docs/content-actions-01.png)

The extension is meant to be a code drop. Use it as-is and feel free to adapt it to your needs.

---

## Installation
The extension can be installed in your Blueprint workspace by copying the code directly.

Download a copy of this repository and extract the files into your Blueprint workspace to `apps/studio-client/apps/main/extensions/content-actions`.

Use the extension tool in the root folder of the project to enable the new extension.
 ```
mvn -f workspace-configuration/extensions/pom.xml extensions:sync -Denable=content-actions
```
