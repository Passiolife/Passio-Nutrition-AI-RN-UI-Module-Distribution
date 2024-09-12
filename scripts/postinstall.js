const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const consoleMessage = (message) => {
  // eslint-disable-next-line no-console
  console.log(message);
};

const runCommand = (command, options = {}) => {
  consoleMessage(`Running command: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    consoleMessage(`Error running command: ${command}`);
    consoleMessage(error);
    process.exit(1); // Exit if any command fails
  }
};

const installDependencies = () => {
  consoleMessage('Installing react-native-linear-gradient...');
  runCommand('yarn add react-native-linear-gradient');
};

const linkLibraries = () => {
  // Uncomment this line if you need to link the libraries manually
  // consoleMessage('Linking react-native-linear-gradient...');
  // runCommand('npx react-native link react-native-linear-gradient');
};

const checkForPodfile = () => {
  const podfilePath = path.join(process.cwd(), 'ios', 'Podfile');
  if (fs.existsSync(podfilePath)) {
    consoleMessage('Podfile found. Running pod install...');
    runCommand('cd ios && pod install');
  } else {
    consoleMessage('No Podfile found, skipping pod install...');
  }
};

try {
  installDependencies();
  consoleMessage(
    `
      ============================================
        🎉 Thank you for using PASSIO UI/UX 🎉
                  🍔🍔🍔
      ============================================
      `
  );

  process.exit(0); // Exit with success code
} catch (error) {
  consoleMessage(
    `
      ============================================
        ⚠️ Process END ⚠️
      ============================================
      `
  );
  process.exit(1); // Exit with error code
}
