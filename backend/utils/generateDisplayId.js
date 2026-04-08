async function generateDisplayId(Model, prefix) {
  const lastDoc = await Model.findOne({
    displayId: { $regex: `^${prefix}` }
  }).sort({ createdAt: -1 });

  if (!lastDoc || !lastDoc.displayId) {
    return `${prefix}001`;
  }

  const numericPart = parseInt(lastDoc.displayId.replace(prefix, ""), 10) || 0;
  const nextNumber = numericPart + 1;

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

module.exports = generateDisplayId;