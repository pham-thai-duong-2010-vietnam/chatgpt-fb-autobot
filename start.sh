#!/bin/bash
Xvfb :99 &  # Fake display cho Chrome headless
export DISPLAY=:99
node facebook_bot.js