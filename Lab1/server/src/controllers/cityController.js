import { City } from '../models/City.js';

export const getCities = async (_req, res) => {
  try {
    const cities = await City.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Не вдалося отримати список міст',
    });
  }
};
export const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Місто не знайдено',
      });
    }

    res.status(200).json({
      success: true,
      data: city,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Не вдалося отримати місто',
    });
  }
};
export const createCity = async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Поля name і country є обов’язковими',
      });
    }

    const city = await City.create({
      name: String(name).trim(),
      country: String(country).trim(),
    });

    res.status(201).json({
      success: true,
      data: city,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Не вдалося створити місто',
    });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Поля name і country є обов’язковими',
      });
    }

    const updatedCity = await City.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        country: String(country).trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCity) {
      return res.status(404).json({
        success: false,
        message: 'Місто не знайдено',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCity,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Не вдалося оновити місто',
    });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCity = await City.findByIdAndDelete(id);

    if (!deletedCity) {
      return res.status(404).json({
        success: false,
        message: 'Місто не знайдено',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Місто видалено',
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Не вдалося видалити місто',
    });
  }
};