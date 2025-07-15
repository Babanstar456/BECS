import pandas as pd

# Sample data
data = [
    {
        "name": "Smartphone X100",
        "category": "Mobile Phones",
        "price": 29999,
        "imglink": "smartphonex100.jpg",
        "description": "A high-end smartphone with great features.",
        "subcat": "Android"
    },
    {
        "name": "Laptop Pro 15",
        "category": "Laptops",
        "price": 74999,
        "imglink": "laptoppro15.jpg",
        "description": "Professional laptop with powerful performance.",
        "subcat": "Ultrabook"
    },
    {
        "name": "Bluetooth Speaker Z",
        "category": "Audio",
        "price": 3999,
        "imglink": "speakerz.jpg",
        "description": "Portable Bluetooth speaker with deep bass.",
        "subcat": "Speakers"
    }
]

# Convert to DataFrame
df = pd.DataFrame(data)

# Save to Excel
df.to_excel("Electronics_Items_Sample.xlsx", index=False)
print("✅ Electronics_Items_Sample.xlsx generated successfully!")
