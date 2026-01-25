
from nselib import capital_market

def test():
    try:
        print("Fetching data for RELIANCE...")
        # Use price_volume_and_deliverable_position_data
        data = capital_market.price_volume_and_deliverable_position_data(symbol='RELIANCE', period='1M')
        print("Data fetched successfully")
        print(data.tail())
        print("Columns:", data.columns)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
