{
  baseUrl: "../out/scripts/scripts",
  include: ["ZR"], // ZR is the 'main' file that then requires all other modules
  out: "../out/full/main.js",
  
  onModuleBundleComplete: function (data) {
    var fs = module.require('fs'),
      amdclean = module.require('amdclean'),
      outputFile = data.path,
      cleanedCode = amdclean.clean({
        'globalModules': ['ZR'], // This will expose the ZR package to global js
                                 // space. To rename this, you also have to change
                                 // scripts/ZR.ts
        'filePath': outputFile
      });
  
    fs.writeFileSync(outputFile, cleanedCode);
  }
}