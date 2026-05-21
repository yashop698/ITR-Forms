#!/bin/bash
grep '^ANTHROPIC_API_KEY=' "$(dirname "$0")/../.env.local" | cut -d'=' -f2-
