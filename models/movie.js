/**
 * Created by cuifancastle on 16-5-1.
 */
var mongoose = require('mongoose');
var MovieSchema  = require('../schemas/movie');
// console.log(MovieSchema);
var Movie = mongoose.model('Movie',MovieSchema);

module.exports= Movie;