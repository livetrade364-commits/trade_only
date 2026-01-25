
import nselib
from nselib import capital_market
print(f"nselib version: {nselib.__version__}")
print("Attributes in capital_market:")
for attr in dir(capital_market):
    if not attr.startswith("__"):
        print(attr)
