"""\
We're not using a database, we are using in memory models
"""

class Entry(object):
    NEW = "New"
    VERIFIED = "Verified"
    LOCKED = "Locked"
    STATES_CHANGE = {
        NEW: VERIFIED,
        VERIFIED: LOCKED,
        LOCKED: VERIFIED,
    }
    
    """An entry in the registry """
    def __init__(self, address, ssn):
        self.address = address
        self.ssn = ssn
        self.status = Entry.NEW
    
    def next(self):
        return Entry.STATES_CHANGE[self.status]
    
    @property
    def label(self):
        label = {
            Entry.NEW: "info",
            Entry.VERIFIED: "success",
            Entry.LOCKED: "danger",
        }
        return label[self.status]
