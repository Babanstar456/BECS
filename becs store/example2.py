import pandas as pd

# Define sample data for Electrical_Items
data = [
    {
        "name": "Ceiling Fan Deluxe",
        "category": "Fans",
        "price": 2500,
        "imglink": "fan123.jpg",
        "description": "High-speed ceiling fan with remote control.",
        "subcat": "Ceiling"
    },
    {
        "name": "LED Tube Light 36W",
        "category": "Lighting",
        "price": 450,
        "imglink": "tube36.jpg",
        "description": "Energy-efficient LED tube light.",
        "subcat": "TubeLight"
    },
    {
        "name": "Electric Iron Pro",
        "category": "Iron",
        "price": 1200,
        "imglink": "ironpro.jpg",
        "description": "Non-stick soleplate with steam function.",
        "subcat": "Steam"
    },
    {
        "name": "Water Heater 15L",
        "category": "Heaters",
        "price": 6500,
        "imglink": "heater15l.jpg",
        "description": "15-liter electric water heater.",
        "subcat": "Storage"
    },
    {
        "name": "Power Extension Board",
        "category": "Accessories",
        "price": 350,
        "imglink": "extension.jpg",
        "description": "4-socket power extension with surge protector.",
        "subcat": "Surge"
    }
]

# Convert to DataFrame
df = pd.DataFrame(data)

# Write to Excel
df.to_excel("Electrical_Sample.xlsx", index=False)

print("✅ Electrical_Sample.xlsx created successfully!")
