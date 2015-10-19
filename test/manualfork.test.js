var expect = require('chai').expect
// var _ = require('lodash')
var mf = require('../manualfork')

/* Definitions for JS Standard */
/* global describe, it */

describe('manualfork', function () {
  it('should be an object', function (done) {
    expect(mf).to.be.an('object')
    done()
  })
  describe('.fork', function () {
    it('should be a function', function (done) {
      expect(mf.fork).to.be.a('function')
      done()
    })
  })
  describe('._internal', function () {
    it('should be an object', function (done) {
      expect(mf._internal).to.be.an('object')
      done()
    })
    describe('createTarget', function () {
      it('should be a function', function (done) {
        expect(mf._internal.createTarget).to.be.a('function')
        done()
      })
    })
    describe('cloneSource', function () {
      it('should be a function', function (done) {
        expect(mf._internal.cloneSource).to.be.a('function')
        done()
      })
    })
    describe('pushTarget', function () {
      it('should be a function', function (done) {
        expect(mf._internal.pushTarget).to.be.a('function')
        done()
      })
    })
    describe('cleanTemp', function () {
      it('should be a function', function (done) {
        expect(mf._internal.cleanTemp).to.be.a('function')
        done()
      })
    })
    describe('buildUrl', function () {
      it('should be a function', function (done) {
        expect(mf._internal.buildUrl).to.be.a('function')
        done()
      })
    })
    describe('gitExec', function () {
      it('should be a function', function (done) {
        expect(mf._internal.gitExec).to.be.a('function')
        done()
      })
    })
    describe('toolsJoin', function () {
      it('should be a function', function (done) {
        expect(mf._internal.toolsJoin).to.be.a('function')
        done()
      })
    })
    describe('deleteFolderRecursive', function () {
      it('should be a function', function (done) {
        expect(mf._internal.deleteFolderRecursive).to.be.a('function')
        done()
      })
    })
    describe('deleteFolderRecursiveAsync', function () {
      it('should be a function', function (done) {
        expect(mf._internal.deleteFolderRecursiveAsync).to.be.a('function')
        done()
      })
    })
  })
})
