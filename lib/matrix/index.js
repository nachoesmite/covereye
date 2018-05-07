const yaml = require('js-yaml');
const fs   = require('fs');
const util = require('util');

module.exports = class CapabilityMatrix {
  constructor(source) {
    if (typeof source === "string") {
      source = yaml.safeLoad(fs.readFileSync(source, 'utf8'));
    }
    this.product = source.product;
    this.matrix = source.matrix;
    this.sanitizeData();
  }

  sanitizeData() {
    this.matrix.components.forEach((component) => {
      if (component.attributes === undefined) {
        component.attributes = [];
      }
      component.capabilities = component.capabilities.map((capability) => {
        if (typeof capability === 'string') {
          return {
            name: capability,
            attributes: component.attributes
          }
        } else {
          capability.attributes = capability.attributes || [];
          component.attributes.forEach((attr) => {
            if (!capability.attributes.includes(attr)) {
              capability.attributes.push(attr);
            }
          });
          return capability
        }
      });
    })
  }

  getMatrix() {
    return this.matrix;
  }
  getFullMatrix() {
    let matrix = {};
    this.matrix.components.forEach((component) => {
      matrix[component.name] = {};
      this.matrix.attributes.forEach((attr) => {
        matrix[component.name][attr] = [];
      });
      component.capabilities.forEach((capability) => {
        capability.attributes.forEach((attr) => {
          matrix[component.name][attr].push(capability.name);
        });
      }) 
    });
    return matrix;
  }

}