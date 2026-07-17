const Appointment = require('../models/Appointment');

exports.saveAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      doctorId,
      doctorName,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      consultationContent,
      urgency,
      timePreference
    } = req.body;

    if (!doctorId || !patientName || !patientPhone) {
      return res.status(400).json({
        code: 400,
        message: '导师ID、学习者姓名和手机号为必填项'
      });
    }

    if (!/^1[3-9]\d{9}$/.test(patientPhone)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的手机号'
      });
    }

    const appointmentId = await Appointment.create({
      userId,
      doctorId,
      doctorName,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      consultationContent,
      urgency,
      timePreference
    });

    return res.status(201).json({
      code: 200,
      message: '学习规划预约已提交',
      data: { id: appointmentId }
    });
  } catch (error) {
    console.error('保存学习规划预约失败:', error);
    return res.status(500).json({ code: 500, message: '保存学习规划预约失败' });
  }
};

exports.getAppointmentList = async (req, res) => {
  try {
    const appointments = await Appointment.findByUserId(req.user.id);
    return res.status(200).json({ code: 200, message: '获取成功', data: appointments });
  } catch (error) {
    console.error('获取学习规划预约列表失败:', error);
    return res.status(500).json({ code: 500, message: '获取学习规划预约列表失败' });
  }
};

exports.getAppointmentByDoctorId = async (req, res) => {
  try {
    const appointments = await Appointment.findByDoctorId(req.params.doctorId);
    return res.status(200).json({ code: 200, message: '获取成功', data: appointments });
  } catch (error) {
    console.error('获取导师预约列表失败:', error);
    return res.status(500).json({ code: 500, message: '获取导师预约列表失败' });
  }
};

exports.getAppointmentByPatientPhone = async (req, res) => {
  try {
    const patientPhone = req.params.patientPhone;
    if (patientPhone !== req.user.phone) {
      return res.status(403).json({ code: 403, message: '无权查看他人预约信息' });
    }
    const appointments = await Appointment.findByPatientPhone(patientPhone);
    return res.status(200).json({ code: 200, message: '获取成功', data: appointments });
  } catch (error) {
    console.error('获取学习者预约列表失败:', error);
    return res.status(500).json({ code: 500, message: '获取预约列表失败' });
  }
};

exports.getAppointmentDetail = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ code: 404, message: '预约不存在' });
    }
    if (appointment.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权查看该预约' });
    }
    return res.status(200).json({ code: 200, message: '获取成功', data: appointment });
  } catch (error) {
    console.error('获取预约详情失败:', error);
    return res.status(500).json({ code: 500, message: '获取预约详情失败' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id, status, notes, timePreference } = req.body;
    if (!id) {
      return res.status(400).json({ code: 400, message: '预约ID为必填项' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ code: 404, message: '预约不存在' });
    }
    if (appointment.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权修改该预约' });
    }

    const success = await Appointment.update(id, {
      status: status || appointment.status,
      notes: notes || appointment.notes,
      timePreference: timePreference || appointment.timePreference
    });

    return res.status(success ? 200 : 500).json({
      code: success ? 200 : 500,
      message: success ? '更新成功' : '更新失败'
    });
  } catch (error) {
    console.error('更新预约失败:', error);
    return res.status(500).json({ code: 500, message: '更新预约失败' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ code: 404, message: '预约不存在' });
    }
    if (appointment.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权删除该预约' });
    }

    const success = await Appointment.deleteById(req.params.id);
    return res.status(success ? 200 : 500).json({
      code: success ? 200 : 500,
      message: success ? '删除成功' : '删除失败'
    });
  } catch (error) {
    console.error('删除预约失败:', error);
    return res.status(500).json({ code: 500, message: '删除预约失败' });
  }
};

exports.batchDeleteAppointment = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ code: 400, message: 'ids 必须是非空数组' });
    }

    let successCount = 0;
    for (const id of ids) {
      if (await Appointment.deleteById(id)) successCount++;
    }

    return res.status(200).json({
      code: 200,
      message: '删除成功',
      data: { deletedCount: successCount }
    });
  } catch (error) {
    console.error('批量删除预约失败:', error);
    return res.status(500).json({ code: 500, message: '批量删除预约失败' });
  }
};

exports.getAppointmentCount = async (req, res) => {
  try {
    const { status, doctorId } = req.query;
    const count = await Appointment.count({ status, doctorId });
    return res.status(200).json({ code: 200, message: '获取成功', data: { count } });
  } catch (error) {
    console.error('获取预约统计失败:', error);
    return res.status(500).json({ code: 500, message: '获取预约统计失败' });
  }
};
