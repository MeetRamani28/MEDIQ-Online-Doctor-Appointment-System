const Specialization = require("../model/specialization-model");

const createSpecialization = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name required!" });

    const exists = await Specialization.findOne({ name });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Specialization already exists!" });

    const specialization = await Specialization.create({
      name,
      description,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Specialization Created",
      specialization,
    });
  } catch (error) {
    console.error("Create Specialization Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await Specialization.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!specialization)
      return res
        .status(404)
        .json({ success: false, message: "Specialization not found!" });

    res.status(200).json({
      success: true,
      message: "Specialization updated",
      specialization,
    });
  } catch (error) {
    console.error("Update Specialization Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const toggleSpecializationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await Specialization.findById(id);
    if (!specialization)
      return res
        .status(404)
        .json({ success: false, message: "Specialization not found!" });

    specialization.isActive = !specialization.isActive;
    await specialization.save();

    res.status(200).json({
      success: true,
      message: "Specialization status updated",
      isActive: specialization.isActive,
    });
  } catch (error) {
    console.error("Toggle Specialization Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: specializations.length,
      specializations,
    });
  } catch (error) {
    console.error("Fetch Specializations Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const fetchDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findOne({
      _id: id,
      role: "doctor",
      isActive: true,
    })
      .select("-password")
      .populate("specialization", "name");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Fetch Doctor By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createSpecialization,
  updateSpecialization,
  toggleSpecializationStatus,
  getAllSpecializations,
  fetchDoctorById,
};
