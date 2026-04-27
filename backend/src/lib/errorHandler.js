/**
 * Handle Prisma errors and return user-friendly messages in Portuguese
 * @param {Error} error - The error object
 * @returns {Object} - Object with status code and message
 */
export function handlePrismaError(error) {
  // Unique constraint violation
  if (error.code === "P2002") {
    const target = error.meta?.target;
    const message = error.message || "";

    // Debug: log the target and message to understand the format
    // console.log("Prisma P2002 error target:", target, "message:", message);

    // Handle different formats of target field
    let fieldName = "campo"; // default fallback

    // Direct check for email in signup context
    if (Array.isArray(target) && target.includes("email")) {
      fieldName = "email";
    } else if (
      message.includes("utilizador") &&
      (message.includes("email") ||
        target === "email" ||
        (Array.isArray(target) && target[0] === "email"))
    ) {
      fieldName = "email";
    }

    // First try to extract from the error message
    if (fieldName === "campo") {
      if (message.includes("`email`")) {
        fieldName = "email";
      } else if (message.includes("`nome`")) {
        fieldName = "nome";
      } else if (message.includes("`nif`")) {
        fieldName = "nif";
      } else if (message.includes("`telefone`")) {
        fieldName = "telefone";
      } else if (message.includes("`numeroSala`")) {
        fieldName = "numeroSala";
      } else if (message.includes("`serialNumber`")) {
        fieldName = "serialNumber";
      } else if (message.includes("email")) {
        fieldName = "email";
      } else if (message.includes("nome")) {
        fieldName = "nome";
      } else if (message.includes("nif")) {
        fieldName = "nif";
      } else if (message.includes("telefone")) {
        fieldName = "telefone";
      } else if (
        message.includes("numeroSala") ||
        message.includes("numero_sala")
      ) {
        fieldName = "numeroSala";
      } else if (
        message.includes("serialNumber") ||
        message.includes("serial_number")
      ) {
        fieldName = "serialNumber";
      }
    }

    // Special handling for signup email conflicts
    if (message.includes("utilizador") && message.includes("email")) {
      fieldName = "email";
    } else if (message.includes("utilizador")) {
      // If it's a utilizador constraint but we can't determine the field, assume email
      fieldName = "email";
    }

    // If still not found, check for single character mappings (fallback for weird cases)
    if (fieldName === "campo" || fieldName.length === 1) {
      // Map single characters to fields (this is a fallback for edge cases)
      const charMap = {
        U: "email", // User email constraint
        I: "nome", // Institution name
        N: "nif", // NIF
        T: "telefone", // Phone
      };
      if (charMap[fieldName]) {
        fieldName = charMap[fieldName];
      }
    }

    const fieldLabels = {
      nome: "Nome",
      email: "Email",
      nif: "NIF",
      numeroSala: "Número da Sala",
      serialNumber: "Número de Série",
      telefone: "Telefone",
    };

    const label = fieldLabels[fieldName] || fieldName;

    return {
      status: 400,
      message: `Este ${label} já existe. Por favor, escolha outro.`,
    };
  }

  // Foreign key constraint violation
  if (error.code === "P2003") {
    return {
      status: 400,
      message: "Referência inválida. O item associado não existe.",
    };
  }

  // Foreign key constraint failed (trying to delete referenced record)
  if (error.code === "P2014") {
    return {
      status: 400,
      message: "Não é possível deletar este item. Ele está sendo usado.",
    };
  }

  // Default error
  return {
    status: 500,
    message: error.message || "Erro ao processar a solicitação.",
  };
}
