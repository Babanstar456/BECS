import pandas as pd

data = [
    {
        "name": "Ultra HD TV",
        "category": "Television",
        "price": 49999,
        "imglink": "tv001.jpg",
        "description": "50-inch 4K Ultra HD Smart TV",
        "subcat": "LED TV"
    },
    {
        "name": "Bluetooth Speaker",
        "category": "Audio",
        "price": 2499,
        "imglink": "spk001.jpg",
        "description": "Portable Bluetooth Speaker with Bass",
        "subcat": "Wireless"
    },
    {
        "name": "Refrigerator 300L",
        "category": "Kitchen",
        "price": 28999,
        "imglink": "fridge.jpg",
        "description": "300 L Frost Free Double Door Fridge",
        "subcat": "Double Door"
    },
    {
        "name": "Washing Machine 7kg",
        "category": "Laundry",
        "price": 19999,
        "imglink": "wm001.jpg",
        "description": "7 kg Fully Automatic Front Load Machine",
        "subcat": "Front Load"
    },
    {
        "name": "Air Conditioner 1.5T",
        "category": "Cooling",
        "price": 35999,
        "imglink": "ac001.jpg",
        "description": "1.5 Ton Split AC with Inverter",
        "subcat": "Split AC"
    }
]

df = pd.DataFrame(data)
df.to_excel("Electronics_Sample.xlsx", index=False)

print("✅ Excel file generated successfully!")
