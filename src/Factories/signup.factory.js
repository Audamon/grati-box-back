import faker from 'faker';

function validBodyFactorySignup() {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

function invalidBodyFactorySignup() {
  return {
    name: faker.name.findName(),
    email: faker.lorem.words(),
    password: faker.internet.password(),
  };
}

export { validBodyFactorySignup, invalidBodyFactorySignup };