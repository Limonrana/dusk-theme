let mix = require('laravel-mix');


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
 mix.js('src/js/app.js', 'assets/')
    .js('src/js/global.js', 'assets/')
   //  .js('src/js/pages/customers.js', 'assets/')
    .sass('src/scss/base.scss', 'assets/')
    .sass('src/scss/global.scss', 'assets/');