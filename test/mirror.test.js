var expect = require('chai').expect
// var _ = require('lodash')
var mirror = require('../mirror')

/* Definitions for JS Standard */
/* global describe, it */

describe('mirror', function () {
  it('should be an object', function (done) {
    expect(mirror).to.be.an('object')
    done()
  })
  describe('.repo', function () {
    it('should be a function', function (done) {
      expect(mirror.repo).to.be.a('function')
      done()
    })
  })
  describe('._internal', function () {
    it('should be an object', function (done) {
      expect(mirror._internal).to.be.an('object')
      done()
    })
    describe('createTarget', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.createTarget).to.be.a('function')
        done()
      })
    })
    describe('cloneSource', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.cloneSource).to.be.a('function')
        done()
      })
    })
    describe('pushTarget', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.pushTarget).to.be.a('function')
        done()
      })
    })
    describe('cleanTemp', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.cleanTemp).to.be.a('function')
        done()
      })
    })
    describe('buildUrl', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.buildUrl).to.be.a('function')
        done()
      })
    })
    describe('gitExec', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.gitExec).to.be.a('function')
        done()
      })
    })
    describe('toolsJoin', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.toolsJoin).to.be.a('function')
        done()
      })
    })
    describe('deleteFolderRecursive', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.deleteFolderRecursive).to.be.a('function')
        done()
      })
    })
    describe('deleteFolderRecursiveAsync', function () {
      it('should be a function', function (done) {
        expect(mirror._internal.deleteFolderRecursiveAsync).to.be.a('function')
        done()
      })
    })
  })
})
