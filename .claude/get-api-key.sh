#!/bin/bash
grep '^CLAUDE_CODE_OAUTH_TOKEN=' "$(dirname "$0")/../.env.local" | cut -d'=' -f2-
