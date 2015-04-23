/*jslint node: true */
"use strict";

var test = require('tape');
var util = require('util');

module.exports = function(driver, dname, setup) {
  test('(' + dname + ') open and close database', function(t) {
    driver.open(function(err) {
      driver.close(function(err) {
        t.end();
      });
    });
  });

  test('(' + dname + ') open database for following tests', function(t) {
    driver.open(function(err) {
      t.end();
    });
  });

  test('(' + dname + ') check/create migration table', function(t) {
    t.plan(5);
    setup(function(err, driver) {
      driver.check(function(err, present) {
        t.error(err, 'check should not error');
        t.notok(present, "migration table should not be present");
        driver.create(function(err) {
          t.error(err, 'create should not error');
          driver.check(function(err, present) {
            t.error(err, 'check should not error');
            t.ok(present, "migration table should be present now");
          });
        });
      });
    });
  });

  test('(' + dname + ') read/set current level', function(t) {
    t.plan(5);
    setup(function(err, driver) {
      driver.create(function(err) {
        driver.current(function(err, level) {
          t.error(err, 'current should not error');
          t.notok(level, "current level should start undefined");
          driver.update(2, function(err) {
            t.error(err, 'update should not error');
            driver.current(function(err, level) {
              t.error(err, 'current should not error');
              t.equal(level, 2, "curret should report new level");
            });
          });
        });
      });
    });
  });

  test('(' + dname + ') close database', function(t) {
    driver.close(function(err) {
      t.end();
    });
  });
}

