import {
  IncidentModel,
  IncidentTypeAdminModel,
} from "../../data/postgres/prisma";
import { CustomError } from "../../domain/error";
import { AsignResponsabilityAdminDto } from "../../domain/dtos/admin/asign-responsability-admin.dto";

export class AdminService {
  public AsignResponsabilityAdmin = async (
    asignResponsabilityAdminDto: AsignResponsabilityAdminDto
  ) => {
    // id --> Es el IDADMIN
    const { id, incident_type_id } = asignResponsabilityAdminDto;

    const AsignedAdmin = await IncidentTypeAdminModel.create({
      data: {
        admin_id: +id,
        incident_type_id: +incident_type_id,
      },
    });

    return {
      AsignedAdmin,
    };
  };

  public getIncidentsByAdminId = async (adminId: number) => {
    if (!adminId) throw CustomError.badRequest("Admin ID is required");

    try {
      const incidents = await IncidentModel.findMany({
        where: { assigned_admin_id: adminId },
        include: {
          location: true,
          incident_type: true,
          incident_status: true,
          app_user_incident_assigned_admin_idToapp_user: true,
          app_user_incident_user_idToapp_user: true,
          incident_history: {
            include: {
              app_user: {
                select: {
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return { incidents };
    } catch (error) {
      console.error("Error fetching incidents by admin ID:", error);
      throw CustomError.internalServer("Error fetching incidents");
    }
  };
}
