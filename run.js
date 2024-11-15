const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
file_name = "List.json";
exec(
  `winget export \"${path.join(__dirname, file_name)}\"`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    // write file unknown.txt
    fs.writeFile(
      path.join(__dirname, "unknown.txt"),
      stdout
        .split("\n")
        .map((line) => {
          return line.split(": ")[1];
        })
        .join("\n"),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
    // read file List.json
    fs.readFile(path.join(__dirname, file_name), "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let Packages = JSON.parse(data)["Sources"][0]["Packages"].map(
        (package) => {
          return (
            "winget install -s winget -e --id --force " +
            package["PackageIdentifier"]
          );
        }
      );
      // write Packages to install.bat
      fs.writeFile(
        path.join(__dirname, "install.bat"),
        "@echo off\n\n" + Packages.join("\n"),
        (err) => {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
      // delete List.json
      fs.unlink(path.join(__dirname, file_name), (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      console.log("\n\nPackages unavailable through winget");
      console.log(
        stdout
          .split("\n")
          .map((line) => {
            return line.split(": ")[1];
          })
          .join("\n")
      );
    });
  }
);
