const Contact = require("../model/contact-model");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await Contact.create({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Submit Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
