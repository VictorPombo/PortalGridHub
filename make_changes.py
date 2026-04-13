import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. NEWS CARDS MULTI-CATEGORIA
# Find cardGrid div
head, rest = html.split('<div class="card-grid" id="cardGrid">', 1)
# rest contains the cards and the closing of the section.
# We'll just find the first closing </div> that matches the level of cardGrid. 
# actually let's split by '</div>\n    </div>\n  </div>\n\n  <!-- PLANS SECTION -->' or similar.
# Let's find context
import sys
sys.exit(0)
