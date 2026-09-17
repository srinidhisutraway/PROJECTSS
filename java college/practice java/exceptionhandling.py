# def calculate_expenditure(list_of_expenditure):
#     total=0
#     try:
#         for expenditure in list_of_expenditure:
#             total+=expenditure
#         print(total)
#     except:
#         print("Some error occured")
#     print("Returning back from function.")
# list_of_values=[100,200,300,"400",500]
# calculate_expenditure(list_of_values)
balance=1000
amount="300Rs"
def take_card():
    print("Take the card out of ATM")
try:
    if balance>=int(amount):
        print("Withdraw")
    else:
        print("Invalid amount")
except TypeError:
    print("Type Error Occurred")
except ValueError:
    print("Value Error Occurred")
except:
    print("Some error Occurred")
finally:
    take_card()
