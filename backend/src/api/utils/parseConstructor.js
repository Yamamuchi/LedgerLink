export const parseConstructor = (code) => {
    const constructorParams = {}; // Initialize an object to store constructor parameters
  
    // Regular expression to match constructor declarations
    const constructorRegex = /constructor\s*\(([^)]*)\)/g;
    const matches = code.matchAll(constructorRegex);
  
    for (const match of matches) {
      const constructorDeclaration = match[0];
      const paramsString = match[1].trim();
  
      const constructorName = 'Constructor'; // You can assign a name to each constructor
      const paramPairs = paramsString.split(',');
  
      const constructorParamsArray = paramPairs.map((paramPair) => {
        const [paramType, ...paramNameParts] = paramPair.trim().split(' ');
        const paramName = paramNameParts.filter(part => !['memory', 'calldata', 'storage'].includes(part)).join(' ');
  
        return { name: paramName, type: paramType };
      });
  
      constructorParams[constructorName] = constructorParamsArray;
    }
  
    return constructorParams; // Return the constructorParams object
  };
  