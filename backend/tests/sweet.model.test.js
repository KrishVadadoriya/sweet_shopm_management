const mongoose = require('mongoose');
const Sweet = require(`../src/models/sweet.model`);

// Connect to a test database before running tests
beforeAll(async () => {
  const url = 'mongodb://localhost:27017/sweet_shop_test';
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the database after each test
afterEach(async () => {
  await Sweet.deleteMany();
});

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Sweet Model Test', () => {
  it('should create and save a sweet successfully', async () => {
    const sweetData = {
      name: 'Chocolate Truffle',
      category: 'Chocolate',
      price: 25.99,
      quantity: 100
    };
    
    const validSweet = new Sweet(sweetData);
    const savedSweet = await validSweet.save();
    
    // Object Id should be defined when successfully saved to MongoDB
    expect(savedSweet._id).toBeDefined();
    expect(savedSweet.name).toBe(sweetData.name);
    expect(savedSweet.category).toBe(sweetData.category);
    expect(savedSweet.price).toBe(sweetData.price);
    expect(savedSweet.quantity).toBe(sweetData.quantity);
  });

  // Test for required fields
  it('should fail to create a sweet without required fields', async () => {
    const sweetWithoutRequiredField = new Sweet({ name: 'Test Sweet' });
    let err;
    
    try {
      await sweetWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // Test for invalid category
  it('should fail to create a sweet with invalid category', async () => {
    const sweetWithInvalidCategory = new Sweet({
      name: 'Invalid Category Sweet',
      category: 'InvalidCategory',
      price: 10.99,
      quantity: 50
    });
    
    let err;
    try {
      await sweetWithInvalidCategory.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.category).toBeDefined();
  });

  // Test for negative price
  it('should fail to create a sweet with negative price', async () => {
    const sweetWithNegativePrice = new Sweet({
      name: 'Negative Price Sweet',
      category: 'Chocolate',
      price: -10.99,
      quantity: 50
    });
    
    let err;
    try {
      await sweetWithNegativePrice.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.price).toBeDefined();
  });

  // Test for negative quantity
  it('should fail to create a sweet with negative quantity', async () => {
    const sweetWithNegativeQuantity = new Sweet({
      name: 'Negative Quantity Sweet',
      category: 'Chocolate',
      price: 10.99,
      quantity: -50
    });
    
    let err;
    try {
      await sweetWithNegativeQuantity.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.quantity).toBeDefined();
  });
});