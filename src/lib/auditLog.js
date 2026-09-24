// Best-effort audit trail writes.
//
// The corporate panels each grew their own copy of this. Audit writes must
// never fail the operation that triggered them — the user's save already
// succeeded — so every failure is swallowed here rather than at each call site.

import { db } from "@/services/api/dataClient";

/**
 * Record one admin/staff action.
 *
 * @param {object} actor   the signed-in user (id + display name)
 * @param {object} entry   { action, entity_type, entity_id, entity_name, description }
 * @returns {Promise<object|null>} the stored row, or null if the write failed
 */
export async function writeAudit(actor, entry) {
  try {
    return await db.entities.AuditLog.create({
      admin_id: actor?.id,
      admin_name: actor?.full_name || actor?.email || "Unknown",
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      entity_name: entry.entity_name,
      description: entry.description,
      created_date: new Date().toISOString(),
    });
  } catch {
    return null;
  }
}

/**
 * Wrap an entity so every create/update/delete writes an audit row.
 *
 * `db.entities` is shared, so the wrapper is a thin proxy rather than a patch
 * on the entity itself — that keeps the audit concern out of the data layer.
 */
export function auditedEntity(entityName, actor) {
  const entity = db.entities[entityName];
  const label = (row) => row?.name || row?.title || row?.email || row?.id || "record";
  const describe = (action, row) => `${action} ${entityName}: ${label(row)}`;

  return {
    ...entity,
    async create(data) {
      const row = await entity.create(data);
      await writeAudit(actor, {
        action: "create",
        entity_type: entityName,
        entity_id: row?.id,
        entity_name: label(row),
        description: describe("Created", row),
      });
      return row;
    },
    async update(id, patch) {
      const row = await entity.update(id, patch);
      await writeAudit(actor, {
        action: "update",
        entity_type: entityName,
        entity_id: id,
        entity_name: label(row),
        description: describe("Updated", row),
      });
      return row;
    },
    async delete(id) {
      const existing = await entity.get(id).catch(() => null);
      await entity.delete(id);
      await writeAudit(actor, {
        action: "delete",
        entity_type: entityName,
        entity_id: id,
        entity_name: label(existing),
        description: describe("Deleted", existing),
      });
    },
  };
}
