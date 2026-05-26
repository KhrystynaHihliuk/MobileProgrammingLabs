import { City } from '../models/City.js';

export const getCities = async (req, res) => {
  try {
    const cities = await City.find({ owner: req.user._id }).sort({
      isFavorite: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: cities,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Не вдалося отримати список міст',
    });
  }
};

export const getCityById = async (req, res) => {
  try {
    const city = await City.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Місто не знайдено',
      });
    }

    return res.status(200).json({
      success: true,
      data: city,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Не вдалося отримати місто',
    });
  }
};

export const createCity = async (req, res) => {
  try {
    const { name, country, isFavorite = false, units = 'metric' } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Поля name і country є обов’язковими',
      });
    }

    const city = await City.create({
      owner: req.user._id,
      name: String(name).trim(),
      country: String(country).trim(),
      isFavorite: Boolean(isFavorite),
      units,
    });

    return res.status(201).json({
      success: true,
      data: city,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Не вдалося створити місто',
    });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { name, country, isFavorite = false, units = 'metric' } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Поля name і country є обов’язковими',
      });
    }

    const updatedCity = await City.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      {
        name: String(name).trim(),
        country: String(country).trim(),
        isFavorite: Boolean(isFavorite),
        units,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCity) {
      return res.status(404).json({
        success: false,
        message: 'Місто не знайдено',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedCity,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Не вдалося оновити місто',
    });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const deletedCity = await City.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deletedCity) {
      return res.status(404).json({
        success: false,
        message: 'Місто не знайдено',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Місто видалено',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Не вдалося видалити місто',
    });
  }
};