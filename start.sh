#!/bin/bash

npx concurrently "npm --prefix backend run dev" "npm --prefix frontend run dev"