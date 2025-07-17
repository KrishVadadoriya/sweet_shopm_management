const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
// const Sweet = require('../models/sweet.model');
const Sweet=require(`../src/models/sweet.model`);
// const sweetRoutes = require('../routes/sweet.routes');
const sweetRoutes=require(`../src/routes/sweet.routes`);


// Create an express app for testing
const app = express();
app.use(express.json());
app.use('/sweets', sweetRoutes);

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

describe('Sweet API', () => {
  // Test for adding a new sweet
  describe('POST /sweets', () => {
    it('should create a new sweet', async () => {
      const sweetData = {
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 100
      };

      const response = await request(app)
        .post('/sweets')
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
      expect(response.body._id).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidSweetData = {
        name: 'Incomplete Sweet'
      };

      const response = await request(app)
        .post('/sweets')
        .send(invalidSweetData)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should return 400 if category is invalid', async () => {
      const invalidCategorySweetData = {
        name: 'Invalid Category Sweet',
        category: 'InvalidCategory',
        price: 10.99,
        quantity: 50
      };

      const response = await request(app)
        .post('/sweets')
        .send(invalidCategorySweetData)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });

  // Test for getting all sweets
  describe('GET /sweets', () => {
    it('should get all sweets', async () => {
      // Add some test sweets
      await Sweet.create([
        {
          name: 'Chocolate Truffle',
          category: 'Chocolate',
          price: 25.99,
          quantity: 100
        },
        {
          name: 'Vanilla Fudge',
          category: 'Candy',
          price: 15.99,
          quantity: 75
        }
      ]);

      const response = await request(app)
        .get('/sweets')
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBeDefined();
      expect(response.body[1].name).toBeDefined();
    });
  });

  // Test for searching sweets by name
  describe('GET /sweets/search', () => {
    it('should search sweets by name', async () => {
      // Add some test sweets
      await Sweet.create([
        {
          name: 'Chocolate Truffle',
          category: 'Chocolate',
          price: 25.99,
          quantity: 100
        },
        {
          name: 'Vanilla Fudge',
          category: 'Candy',
          price: 15.99,
          quantity: 75
        }
      ]);

      const response = await request(app)
        .get('/sweets/search?name=Chocolate')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Chocolate Truffle');
    });

    it('should search sweets by category', async () => {
      // Add some test sweets
      await Sweet.create([
        {
          name: 'Chocolate Truffle',
          category: 'Chocolate',
          price: 25.99,
          quantity: 100
        },
        {
          name: 'Vanilla Fudge',
          category: 'Candy',
          price: 15.99,
          quantity: 75
        }
      ]);

      const response = await request(app)
        .get('/sweets/search?category=Candy')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].category).toBe('Candy');
    });

    it('should search sweets by price range', async () => {
      // Add some test sweets
      await Sweet.create([
        {
          name: 'Chocolate Truffle',
          category: 'Chocolate',
          price: 25.99,
          quantity: 100
        },
        {
          name: 'Vanilla Fudge',
          category: 'Candy',
          price: 15.99,
          quantity: 75
        }
      ]);

      const response = await request(app)
        .get('/sweets/search?minPrice=20&maxPrice=30')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Chocolate Truffle');
    });
  });

  // Test for deleting a sweet
  describe('DELETE /sweets/:id', () => {
    it('should delete a sweet', async () => {
      // Add a test sweet
      const sweet = await Sweet.create({
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 100
      });

      await request(app)
        .delete(`/sweets/${sweet._id}`)
        .expect(200);

      // Verify the sweet was deleted
      const deletedSweet = await Sweet.findById(sweet._id);
      expect(deletedSweet).toBeNull();
    });

    it('should return 404 if sweet not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/sweets/${nonExistentId}`)
        .expect(404);
    });
  });

  // Test for purchasing a sweet
  describe('POST /sweets/:id/purchase', () => {
    it('should reduce the quantity when purchased', async () => {
      // Add a test sweet
      const sweet = await Sweet.create({
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 100
      });

      const purchaseData = { quantity: 10 };

      const response = await request(app)
        .post(`/sweets/${sweet._id}/purchase`)
        .send(purchaseData)
        .expect(200);

      expect(response.body.quantity).toBe(90); // 100 - 10 = 90

      // Verify the quantity was updated in the database
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(90);
    });

    it('should return 400 if trying to purchase more than available', async () => {
      // Add a test sweet
      const sweet = await Sweet.create({
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 100
      });

      const purchaseData = { quantity: 101 }; // More than available

      await request(app)
        .post(`/sweets/${sweet._id}/purchase`)
        .send(purchaseData)
        .expect(400);

      // Verify the quantity was not updated
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(100);
    });
  });

  // Test for restocking a sweet
  describe('POST /sweets/:id/restock', () => {
    it('should increase the quantity when restocked', async () => {
      // Add a test sweet
      const sweet = await Sweet.create({
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 100
      });

      const restockData = { quantity: 50 };

      const response = await request(app)
        .post(`/sweets/${sweet._id}/restock`)
        .send(restockData)
        .expect(200);

      expect(response.body.quantity).toBe(150); // 100 + 50 = 150

      // Verify the quantity was updated in the database
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(150);
    });

    it('should return 400 if restock quantity is negative', async () => {
      // Add a test sweet
      const sweet = await Sweet.create({
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 100
      });

      const restockData = { quantity: -10 }; // Negative quantity

      await request(app)
        .post(`/sweets/${sweet._id}/restock`)
        .send(restockData)
        .expect(400);

      // Verify the quantity was not updated
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(100);
    });
  });
});