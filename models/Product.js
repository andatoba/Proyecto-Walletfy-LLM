import mongoose from 'mongoose';

const productCategoriesEnum = [
  'electronics',
  'clothing', 
  'food',
  'services',
  'books',
  'home',
  'transportation',
  'health',
  'entertainment',
  'other'
];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [1, 'El nombre debe tener al menos 1 carácter'],
    maxlength: [50, 'El nombre debe tener máximo 50 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción debe tener máximo 200 caracteres'],
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0.01, 'El precio debe ser un número positivo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: productCategoriesEnum,
      message: 'Categoría inválida. Debe ser una de: {VALUE}'
    }
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        const urlRegex = /^https?:\/\/.+/;
        return urlRegex.test(v);
      },
      message: 'La URL de imagen debe ser válida'
    },
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { 
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      if (ret.isDeleted) delete ret.isDeleted;
      return ret;
    }
  }
});

// Índices para optimizar consultas
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ isDeleted: 1 });

// Middleware para filtrar productos eliminados por defecto
productSchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});

const Product = mongoose.model('Product', productSchema);

export default Product;