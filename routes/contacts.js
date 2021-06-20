const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route    GET api/contacts
// @desc     Get all users contacts
// @access   Private
router.get('/', auth, async (req, res) => {
   try {
      const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
      console.log(contacts);
      res.json(contacts);
   } catch (err) {
      console.err(err.message);
      res.status(500).send('Server error');
   }
});

// @route    POST api/contacts
// @desc     Add new contact
// @access   Private
router.post('/', [ auth, [
   check(
      'name',
      'Name is required')
      .not()
      .isEmpty()
]], async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
   }

   const { name, email, phone, type } = req.body;

   try {
      const newContact = new Contact({
         name,
         email,
         phone,
         type,
         //reachable becauseo of the auth middleware.
         user: req.user.id
      })

      const contact = await newContact.save();

      res.json(contact);
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
   }
 });

// @route    PUT api/contacts/:id
// @desc     Update contact
// @access   Private
router.put('/:id', auth, async (req, res) => {
   const { name, email, phone, type } = req.body;
   
   // Build contact object
   const contactFields = {};
   if (name) contactFields.name = name;
   if (email) contactFields.email = email;
   if (phone) contactFields.phone = phone;
   if (type) contactFields.type = type;

   try {
      let contact = await Contact.findById(req.params.id);

      if (!contact) return res.status(404).json({ msg: 'Contact not found' });

      // Make sure user owns contact
      if(contact.user.toString() !== req.user.id) {
         return res.status(401).json({ msg: 'Not authorized' });
      }

      contact = await Contact.findByIdAndUpdate(req.params.id,
         { $set: contactFields },
         //If the contact does not exist, it will create it
         { new: true }
      );

      res.json(contact);

   } catch (err) {
      console.err(error.message);
      res.status(500).send('Server Error');
   }
});

// @route    DELETE api/contacts/:id
// @desc     Delete contact
// @access   Private
router.delete('/:id', auth, async (req, res) => {
   try {
      let contact = await Contact.findById(req.params.id);

      if (!contact) return res.status(404).json({ msg: 'Contact not found' });

      // Make sure user owns contact
      if(contact.user.toString() !== req.user.id) {
         return res.status(401).json({ msg: 'Not authorized' });
      }
      
      //The method delete is depecrated, this is the one that must be used.
      await Contact.findByIdAndRemove(req.params.id);

      res.json({ msg: 'Contact removed' });

   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
 });

module.exports = router;