export const validatePassword = (password: string): boolean => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&+]{8,}$/;
  return regex.test(password);
};

export const generateRandomUsername = (givenName: string): string => {
  const cleanName = givenName.replace(/[^a-zA-Z0-9]/g, "");
  const randomSuffix = Math.floor(Math.random() * 1000);
  return cleanName + randomSuffix;
};
