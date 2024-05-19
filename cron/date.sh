#!/bin/bash

# Function to convert date to epoch time (seconds since 1970-01-01)
date_to_epoch() {
  date -d "$1" +"%s"
}

# Function to convert epoch time back to date in DDMMYY format
epoch_to_date() {
  date -d @"$1" +"%d%m%y"
}

# Start date in YYYY-MM-DD format (modify this as needed)
start_date="2023-01-10"

# Get today's date in YYYY-MM-DD format
today=$(date +"%Y-%m-%d")

# Convert dates to epoch time
start_epoch=$(date_to_epoch "$start_date")
today_epoch=$(date_to_epoch "$today")

# Loop from start date to today
current_epoch=$start_epoch
while [ "$current_epoch" -le "$today_epoch" ]; do
  # Convert current epoch time to DDMMYY format and print it
  current_date=$(epoch_to_date "$current_epoch")
  echo "$current_date"
  bash runner.sh "$current_date"
  
  # Move to the next day (86400 seconds in a day)
  current_epoch=$((current_epoch + 86400))
done
