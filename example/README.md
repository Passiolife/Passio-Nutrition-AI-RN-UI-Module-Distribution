
# Getting Started

Yarn version <= 1.22.22
<br/>
Xcode Version >= 15.3

## Step 1: Create a .npmrc file at root directory

```
//npm.pkg.github.com/:_authToken="YOUR_GITHUB_AUTH_TOKEN"
@passiolife:registry=https://npm.pkg.github.com


```

## Step 2: Create a .npmrc file at example root directory

```
//npm.pkg.github.com/:_authToken="YOUR_GITHUB_AUTH_TOKEN"
@passiolife:registry=https://npm.pkg.github.com

```

## Step 3: Create a .env file at example root directory

```
ENV_PASSIO_KEY = "Your Passio Key"
```

## Step 4: Install dependencies at root directory

```
yarn
```

## Step 4: navigate to example  directory

```
cd example
```

### Run iOS

```bash
# OR using Yarn
yarn ios
```

### Run Android

```bash
# OR using Yarn
yarn android
```
